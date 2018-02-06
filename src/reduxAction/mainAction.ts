import {fromJS} from 'immutable';
require('es6-promise').polyfill();
require('isomorphic-fetch');
const getMainData:any = () =>(dispatch:any,getState:any)=>{
    dispatch({type:"GET_MAIN_INITDATA_START"});
    fetch(' https://www.easy-mock.com/mock/5a37bfa7f35c302f83ac0021/movieOnlineData')
    .then(response => response.json())
    .then((data)=>dispatch({type:"GET_MAIN_INITDATA_DONE",payload:fromJS(data.data)}))
}
export {getMainData};