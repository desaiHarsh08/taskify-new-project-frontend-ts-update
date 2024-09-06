import User from "@/lib/user";
import { API } from "@/utils/api";

type DoLoginParams = {
    email: string;
    password: string;
}
export const doLogin = async ({ email, password }: DoLoginParams): Promise<{ accessToken: string, user: User }> => {
    const response = await API.post('/auth/login', { email, password }, {
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });

    return response.data;
}

export const fetchUserByEmail = async (email: string) => {
    const response = await API.get(`/api/users/email/${email}`);

    return response.data as User
}

export const fetchUserById = async (userId: number) => {
    const response = await API.get(`/api/users/${userId}`);

    return response.data as User;
}

export const fetchAllUsers = async () => {
    const response = await API.get('/api/users');
    console.log(response.data);

    return response.data as User[]
}

export const updateUser = async (updatedUser: User) => {
    const response = await API.post(`/api/v1/users/${updatedUser.id}`, updateUser, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return response.data as User;
}