import axios from "axios"
import { setAlert } from './alert'
import { REGISTER_FAIL,REGISTER_SUCCESS } from "./types"
export const register = (name,email,password) => async  dispatch => {
    const config = {
        headers:{
            'Content-Type':'application/json'
        }
    }
    const body = JSON.stringify({name,email,password});
    try {
        const response = await axios.post('http://localhost:5000/api/users',body,config)
        dispatch({
            type:REGISTER_SUCCESS,
            payload:response.data
        })
    } catch (error) {
        const err = error.response.data.errors
        if(err){
            err.forEach(err=>dispatch(setAlert(err.msg,'danger')))
        }
        dispatch({
            type:REGISTER_FAIL
        })
           
    }
}