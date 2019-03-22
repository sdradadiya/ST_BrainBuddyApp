import axios from 'axios'

export function CallApi(url,type='get',data={},header={}) {
    let reqHeader = Object.assign(header, {"Accept":"application/json", "Content-Type": "application/json"});
    // console.log("---------API CALL------");
    // console.log(url);
    // console.log(data);
    // console.log("-----------------------");
    if(type === 'get'){
        return axios.get(url,{headers: reqHeader})
            .then((response) => {
                return Promise.resolve(response.data)
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }else if(type === 'post') {
        return axios.post(url,data,{headers: reqHeader})
            .then((response) => {
                return Promise.resolve(response)
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }else if(type === 'delete'){
        return axios.delete(url,{headers:reqHeader})
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }else if(type === 'patch'){
        return axios.patch(url,data,{headers:reqHeader})
            .then((response) => {
                return Promise.resolve(response)
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    }
}