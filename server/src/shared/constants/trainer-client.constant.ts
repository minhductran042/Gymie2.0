export const TrainerClientStatus = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
}

export type TrainerClientStatus = (typeof TrainerClientStatus)[keyof typeof TrainerClientStatus]