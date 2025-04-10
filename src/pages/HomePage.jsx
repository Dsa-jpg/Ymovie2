import { useEffect,useState } from "react";
import React  from "react";

const HomePage = () => {    

    const [name,setName] = useState('')

 useEffect(() => {

    try {
        const u_name = localStorage.getItem('username')
        setName(u_name)
        
    } catch (error) {
        setName('')
    }
    

 }, []);

return(
<div>
    <h1>Welcome to the App {name}</h1>
</div>
)

}
export default HomePage;