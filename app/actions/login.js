/**
 * Created by peter on 1/26/17.
 */

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export function login(){
    return {
        type: LOGIN
    }
}

export function logout(){
    return {
        type: LOGOUT
    }
}