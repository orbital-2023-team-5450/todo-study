import React, { SetStateAction } from "react";
import supabase from "../supabase";
import { NavigateFunction } from "react-router-dom";

/**
 * Fetches the information from the users table in Supabase, and stores it in a
 * React state using setData. Use a useEffect() hook to ensure that this
 * always runs when a page is first loaded. To use this, set this as the initial state:
 * { user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "",
 * telegram_handle: "", created_at: "" }
 * 
 * @param setData The React state function to store the data from the database.
 * @param loading Whether the page is loading or not.
 * @param setLoading The React state function to set the loading React state.
 * @param navigate A React Router navigate function, or null. Can use the useNavigate() hook in React components.
 * @param publicAvatarUrl Boolean variable indicating whether to use public avatar URL from Supabase instead of given URL
 * @returns A Promise<void> indicating whether the data has been stored by the setData function.
 */
export default async function fetchUserInfo(setData : React.Dispatch<React.SetStateAction<any>>, loading : boolean, setLoading : React.Dispatch<React.SetStateAction<boolean>>, navigate : NavigateFunction | null, publicAvatarUrl : boolean) : Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;
      
    supabase.from('users').select().eq("user_id", user_id).then((result) => {
        console.log(result.error);
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
export function getUsernameFromId(id : string, setData: React.Dispatch<SetStateAction<any>>) {
    return supabase.from('users').select().eq("user_id", id).then((result) => {
        console.log(result.error);
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