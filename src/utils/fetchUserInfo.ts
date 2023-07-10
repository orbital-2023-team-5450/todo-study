import React, { SetStateAction } from "react";
import supabase from "../supabase";
import { NavigateFunction } from "react-router-dom";

/**
 * The type representing the user data, as represented in the users table in the database.
 */
export type UserInfo = {
    user_id: string,
    user_name: string,
    first_name: string,
    last_name: string, 
    avatar_url: string,
    theme: string,
    telegram_handle: string,
    created_at: string,
};

/**
 * A constant representing the default value for the user data if the database is unable to
 * fetch any user data.
 */
export const DEFAULT_USER_INFO : UserInfo = {
    user_id: "",
    user_name: "", 
    first_name: "", 
    last_name: "", 
    avatar_url: "", 
    theme: "",
    telegram_handle: "",
    created_at: "" 
}

/**
 * Fetches the information from the users table in Supabase, and stores it in a
 * React state using setData. Use a useEffect() hook to ensure that this
 * always runs when a page is first loaded. To use this, set DEFAULT_USER_INFO as the initial state.
 * 
 * @param setData The React state function to store the data from the database.
 * @param loading Whether the page is loading or not.
 * @param setLoading The React state function to set the loading React state.
 * @param navigate A React Router navigate function, or null. Can use the useNavigate() hook in React components.
 * @param publicAvatarUrl Boolean variable indicating whether to use public avatar URL from Supabase instead of given URL
 * @returns A Promise indicating whether the data has been stored by the setData function. The result of the Promise is
 *          also passed on as setData only changes after a render.
 */
export default async function fetchUserInfo(setData : React.Dispatch<React.SetStateAction<any>>, loading : boolean, setLoading : React.Dispatch<React.SetStateAction<boolean>>, navigate : NavigateFunction | null, publicAvatarUrl : boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;
      
    return supabase.from('users').select().eq("user_id", user_id).then((result) => {
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
        } else if (result.data[0] === null || result.data[0] === undefined) {
            // user has not created account yet but has been directed to dashboard
            if (navigate !== null) navigate("/create-account");
        } else if (loading) {
            // user has created account. ensure images do not reload unless
            // the page has been refreshed.
            setLoading(false);
            const userData = result.data[0];
            if (publicAvatarUrl) userData.avatar_url = getPublicAvatarUrl(userData.avatar_url);
            setData(userData);
        }
        return result;
    });
};

/**
 * Returns the avatar URL from the Supabase avatar collection (if file exists).
 * 
 * @param filename The filename to find the public avatar URL in Supabase.
 * @returns The public Supabase URL of the avatar file input.
 */
function getPublicAvatarUrl(filename : string) : string {
    return supabase.storage.from('avatars').getPublicUrl(filename).data.publicUrl;
}

/**
 * Returns the username of the account given by a specific ID.
 * 
 * @param id The ID to find the username for.
 * @returns A promise containing the username.
 */
export async function getUsernameFromId(id : string, setData: React.Dispatch<SetStateAction<any>>) {
    supabase.from('users').select().eq("user_id", id).then((result) => {
        if (result.data === null || result.data === undefined || result.error) {
            console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
        } else if (result.data[0] === null || result.data[0] === undefined) {
            // account doesn't exist.
            setData("");
        } else {
            // account exists
            setData(result.data[0].user_name);
        }
    });
}