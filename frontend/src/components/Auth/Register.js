import React,{Fragment,useState} from 'react'

const Register = () => {
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password1:''
    })
    const {name,email,password,password1} = formData
    const onSubmit = (e) => {
        e.preventDefault()
        if(password1!==password){
            console.log('Passord do not match')
        }
        else{
            console.log(formData)
        }
    }
    return (
        <Fragment>
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={(e)=>onSubmit(e)}>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Name" 
                    name="name" 
                    value={name}
                    onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}
                    required 
                />
            </div>
            <div className="form-group">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email"
                    value={email}
                    onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})} 
                    required
                />
                <small className="form-text"
                >This site uses Gravatar so if you want a profile image, use a
                Gravatar email</small
                >
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password}
                    onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password1"
                    minLength="6"
                    value={password1}
                    onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}
                    required
                />
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
        Already have an account? <a href="login.html">Sign In</a>
        </p>
        </Fragment>
    )
}

export default Register
