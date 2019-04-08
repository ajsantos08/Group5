import React, {Component} from 'react';
import logo from '../shuffl_logo_white.png';
import Form from 'react-bootstrap/Form';
import axios from "axios";

// import Button from 'react-bootstrap/Button';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signUp: true,
            name: '',
            email: '',
            password: '',
            password2: ''
        };

        this.switchSignUp = this.switchSignUp.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    switchSignUp = () => {
        const {signUp} = this.state;
        this.setState({signUp: !signUp})

    };

    handleChange = (event) => {
        const name = event.target.name;

        this.setState({[name]: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:4000/users/register', this.state)
            .then(response => {
                console.log(response.data);
                document.getElementById('badfill').innerText = "";
                document.getElementById('badpassword').innerText = "";
                document.getElementById('registered').innerText = "";

                if(response.data.hasOwnProperty('success')){
                    //redirect
                    alert('success');
                }else if(response.data.hasOwnProperty('fill')){
                    //alert(response.data.fill);
                    document.getElementById('badfill').innerText = "Are you even trying?";
                }else if(response.data.hasOwnProperty('match')){
                    //alert(response.data.match);
                    document.getElementById('badpassword').innerText = "bruh, they don't even match";
                }else if(response.data.hasOwnProperty('passlength')){
                    //alert(response.data.passlength);
                    document.getElementById('badpassword').innerText = "yikes, password length needs to be at least 6";
                }else if(response.data.hasOwnProperty('already')){
                    //alert(response.data.already);
                    document.getElementById('registered').innerText = "Email already registered fam";
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    };
    authenticate = () =>{
        this.props.authenticate();
    }

    render() {

        return (
            <div className="SignUp">
                <header className="SignUpHeader">
                    <img src={logo} className="signInLogo" alt="signinlogo"/>
                    <div className="signIn">
                        {/*<p>SIGN IN</p>*/}
                        <span id={"registered"}></span>
                        <span id={"badfill"}></span>
                        <span id={"badname"}></span>
                        <Form>
                            <Form.Group controlId={"form"}>
                                <Form.Control name={"name"} type={"username"} onChange={this.handleChange} placeholder={"Username"} />
                            </Form.Group>
                            {
                                this.state.signUp ?
                                    <span id={"bademail"}></span>
                                    : <Form.Group controlId={"form"}>
                                        <Form.Control name={"email"} type="email" onChange={this.handleChange} placeholder="email"/>
                                    </Form.Group>
                            }
                            <span id={"badpassword"}></span>
                            <Form.Group controlId={"form"}>
                                <Form.Control name={"password"} type="password" onChange={this.handleChange} placeholder="Password"/>
                            </Form.Group>
                            {
                                this.state.signUp ?
                                    <div>
                                        <div>
                                            <div onClick={this.authenticate} className="button primary">Login</div>
                                        </div>
                                        <div className="secondaryText">
                                            <div onClick={this.switchSignUp} className="link secondary">Sign Up</div>
                                        </div>
                                        <div className="secondaryText">
                                            <button className="link forgotpass">Forgot password?</button>
                                        </div>
                                    </div>
                                    : <div>
                                        <Form.Group controlId={"form"}>
                                            <Form.Control name={"password2"} type="password" onChange={this.handleChange} placeholder="Re-enter Password"/>
                                        </Form.Group>
                                        <div className="secondaryText"><input className="agree" type="checkbox"></input>I
                                            have read the <div className="link secondary"> terms & conditions</div></div>
                                        <div>
                                            <div onClick={this.handleSubmit} className="button primary">Sign Up</div>
                                        </div>
                                        <div className="secondaryText">
                                            Already a user?
                                            <div onClick={this.switchSignUp} className="link secondary">Login</div>
                                        </div>
                                    </div>
                            }
                        </Form>
                    </div>
                </header>
            </div>
        );
    }
}

export default SignUp;