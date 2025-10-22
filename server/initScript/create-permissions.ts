import { NestFactory } from "@nestjs/core";
import path from "path";
import { AppModule } from "src/app.module";
import { HTTPMethod } from "src/shared/constants/http.constant";
import { RoleName } from "src/shared/constants/role.constant";
import { PrismaService } from "src/shared/services/prisma.service";
import id from "zod/v4/locales/id.js";

const prismaService = new PrismaService()

const TrainerModule = ['AUTH','TRAINER', 'MEDIA', 'TRAINER-TRANSLATION', 'PROFILE', 'TRAINER-CLIENT']

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;
  const permissionInDB = await prismaService.permission.findMany({
    where: {
      deletedAt: null
    }
  })

  const availableRoutes: {path: string, method: keyof typeof HTTPMethod, name: string, module : string}[] = router.stack
    .map(layer => {
      if (layer.route) {
        const path = layer.route?.path
        const method = String(layer.route?.stack[0].method).toUpperCase() as keyof typeof HTTPMethod
        const moduleName = path.split('/')[1].toUpperCase()
        return {
          path,
          method,
          name:  method + path,
          module: moduleName
        };
        
      }
    })
    .filter(item => item !== undefined)


    //Tạo object permission với key là [method-path]
    const permissionInDBMap : Record<string, typeof permissionInDB[0]> = permissionInDB.reduce((acc,item) => {
      acc[`${item.method}-${item.path}`] = item
      return acc
    }, {})



    // console.log(permissionInDBMap)

    //Tao object voi available route la [method-path]
    const availableRoutesMap : Record<string, typeof permissionInDB[0]> = availableRoutes.reduce((acc, item) => {
      acc[`${item.method}-${item.path}`] = item
      return acc
    }, {})


    //* Nếu route có trong database mà không có trong availableRoute thì xóa trong database những route đó
    //1.Tim permission trong database ma khong ton tai trong available route
    const permissionToDelete = permissionInDB.filter(item => {
      return !availableRoutesMap[`${item.method}-${item.path}`]
    })
    //2.Xoa permission khong ton tai trong availableRoutes
    if(permissionToDelete.length > 0) {
      const deleteResult = await prismaService.permission.deleteMany({
        where: {
          id: {
            in: permissionToDelete.map(item => item.id)
          }
        }
      })
      console.log("Delete Permission", deleteResult.count)
    }

    


    //*Nếu route chưa có trong database mà có trong availableRoute thì thêm vào database
    //1. Tìm những route chưa có trong database mà có trong availableRoute
    const routesToAdd = availableRoutes.filter(item => {
      return !permissionInDBMap[`${item.method}-${item.path}`]
    })

    //2. Thêm vào database
    if(routesToAdd.length > 0) {
      const permissionToAdd = await prismaService.permission.createMany({
        data: routesToAdd,
        skipDuplicates: true
      })
      console.log("Added permissions:", permissionToAdd.count)
    } else {
      console.log("No permission add")
    }

    
    const updatedPermissionsInDB = await prismaService.permission.findMany({
      where: {
        deletedAt: null
      }
    })

    const adminPermissionIds = updatedPermissionsInDB.map(permission => ({
      id: permission.id // update can mang {id: number}
    }))

    const trainerPermissionIds = updatedPermissionsInDB.filter(permission => TrainerModule.includes(permission.module))
    .map(permission => ({ id: permission.id }))


    // console.log(updatedPermissionsInDB.filter(permission => TrainerModule.includes(permission.module)))
    await Promise.all([
      updateRole(adminPermissionIds, RoleName.ADMIN),
      updateRole(trainerPermissionIds, RoleName.TRAINER)
    ])
   

  process.exit(0) // dung lai : Ctr+C
}

const updateRole = async (permissionIds: {id: number}[], roleName: string) => {
    //Cap nhat lai toan bo permission cho admin
     const role = await prismaService.role.findFirstOrThrow({
      where: {
        name: roleName,
        deletedAt: null
      }
    })

    await prismaService.role.update({
      where: {
        id: role.id
      }, 
      data: {
        permissions: {
          set: permissionIds
        }
      }
    })
  }

  
bootstrap();