import { User } from "../user/user.model"

const findLastid = async() : Promise<string | undefined> => {
    const lastAdmin = await User.findOne({role: 'admin'}, {id: 1, _id:0}).sort({createdAt: -1}).lean();
    return lastAdmin?.id ? lastAdmin.id : undefined;
}

export const generateAdminId = async() => {
    let currentId = (0).toString()
    const lastid = await findLastid()
    const lastidDigits = lastid?.substring(2);
    if(lastid){
        currentId = lastidDigits as string
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4,'0') 
    incrementId = `A-${incrementId}`
    return incrementId
}