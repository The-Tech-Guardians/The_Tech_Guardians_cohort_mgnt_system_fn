
export const getCurrentUser = async () => {
     
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;

}