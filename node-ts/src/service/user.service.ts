async function getProfile(uid: string): Promise<any> {
    try {        

        // const config = {
        //     method: 'get',
        //     url: `https://api.agify.io?name=meelad`,             
        // };
        // const response = await axios(config);
        const result = { name : 'isakki' , id : 1}
        return result;
    } catch (e) {
        throw e;
    }        
}

export const UserService = { getProfile };
