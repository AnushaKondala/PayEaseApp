const zod=require('zod');
const userInfo=zod.object({
    username:zod.string().email(),
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[\d]/).regex(/[^A-Za-z0-9]/),
})
const credentials=zod.object({
    username:zod.string().email(),
    password:zod.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[\d]/).regex(/[^A-Za-z0-9]/)
})
const updateBody=zod.object({
    firstName:zod.string().optional(),
    lastName:zod.string().optional(),
    password:zod.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[\d]/).regex(/[^A-Za-z0-9]/).optional()
})
module.exports={
    userInfo,
    credentials,
    updateBody
}