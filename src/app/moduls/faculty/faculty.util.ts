import { User } from '../user/user.model';

const findLastFacultyId = async (): Promise<string | undefined> => {
    const lastFaculty = await User.findOne({role: 'faculty'}, {id: 1, _id: 0}).sort({ createdAt: -1 })
    .lean();
    // console.log("Last faculty id",lastFaculty?.id && lastFaculty.id)
    return lastFaculty?.id ? lastFaculty.id : undefined 
  };

export const generateFacultyId = async()=>{
    let currentId = (0).toString() //0000

    const lastFacultyId = await findLastFacultyId();
    const lastFacultyIdDigits = lastFacultyId?.substring(2);//0001;
    
    if(lastFacultyId){
        currentId = lastFacultyIdDigits as string;
    }
    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
    incrementId = `F-${incrementId}`;

    return incrementId
}
  