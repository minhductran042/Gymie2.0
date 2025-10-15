import { Injectable } from '@nestjs/common';
import {compare , hash} from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class HashingService {
    hash(password: string) {
        return hash(password, saltRounds)
    }

    compare(value: string, hash: string) {
        return compare(value, hash)
    }
}
