import axios from 'axios';

const instance = axios.create( {
    baseURL: 'https://burger-builder-react-deb46-default-rtdb.firebaseio.com/'
})

export default instance;