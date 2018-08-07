import React, { Component } from 'react';
import 'whatwg-fetch';
import { setInStorage, getFromStorage } from '../../utils/storage';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            token: '',
            signUpError: '',
            signInError: '',
            signInEmail: '',
            signInPassword: '',
            signUpEmail: '',
            signUpPassword: ''
        };
        this.onChangeSignInEmail = this.onChangeSignInEmail.bind(this);
        this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);
        this.onChangeSignUpEmail = this.onChangeSignUpEmail.bind(this);
        this.onChangeSignUpPassword = this.onChangeSignUpPassword.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        const obj = getFromStorage('mern-user-auth');
        if (obj && obj.token) {
            const { token } = obj;
            // Verify token
            fetch('/api/account/verify?token=' + token)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token,
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                        });
                    }
                });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    onChangeSignInEmail(event) {
        this.setState({
          signInEmail: event.target.value,
        });
    }

    onChangeSignInPassword(event) {
        this.setState({
          signInPassword: event.target.value,
        });
    }

    onChangeSignUpEmail(event) {
        this.setState({
          signUpEmail: event.target.value,
        });
    }

    onChangeSignUpPassword(event) {
        this.setState({
          signUpPassword: event.target.value,
        });
    }

    onSignUp() {
        const { 
            signUpEmail,
            signUpPassword,
        } = this.state;

        this.setState({
            isLoading: true,
        });

        fetch('/api/account/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signUpEmail,
                password: signUpPassword
            })
        }).then(res => res.json())
          .then(json => {
              if(json.success) {
                  this.setState({
                      signUpError: json.message,
                      isLoading: false,
                      signUpEmail: '',
                      signUpPassword: ''
                  });
              } else {
                  this.setState({
                      signUpError: json.message,
                      isLoading: false
                  });
              }
          })
    }

    onSignIn() {
        const { signInEmail, signInPassword } = this.state;
        this.setState({
          isLoading: true,
        });
        // Post request to backend
        fetch('/api/account/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword,
            })
        }).then(res => res.json())
        .then(json => {
            console.log('json', json);
            if (json.success) {
                setInStorage('mern-user-auth', {
                    token: json.token
                });
                this.setState({
                    signInError: json.message,
                    isLoading: false,
                    signInPassword: '',
                    signInEmail: '',
                    token: json.token,
                });
            } else {
                this.setState({
                    signInError: json.message,
                    isLoading: false,
                });
            }
        });
    }

    logout() {
        this.setState({
            isLoading: true,
        });
        const obj = getFromStorage('mern-user-auth');
        if (obj && obj.token) {
            const { token } = obj;
            // Verify token
            fetch('/api/account/logout?token=' + token)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        token: '',
                        isLoading: false
                    });
                } else {
                    this.setState({
                        isLoading: false,
                    });
                }
            });
        } else {
            this.setState({
                isLoading: false,
            });
        }
    }

    render() {
        const {
            isLoading,
            token,
            signUpError,
            signUpEmail,
            signUpPassword,
            signInError,
            signInEmail,
            signInPassword
        } = this.state;

        if (isLoading) {
            return (<div><p>Loading...</p></div>);
        }

        if(!token) {
            return (
                <div>
                    <div>
                        {
                            (signInError) ? (
                                <p>{ signInError }</p>
                            ) : (null)
                        }
                        <p>Sign In</p>
                        <input type="email" placeholder="Email" value={signInEmail} onChange={this.onChangeSignInEmail} />
                        <br />
                        <input type="password" placeholder="Password" value={signInPassword} onChange={this.onChangeSignInPassword} />
                        <br />
                        <button onClick={this.onSignIn}>Sign In</button>
                    </div>
                    <br />
                    <br />
                    <div>
                        {
                            (signUpError) ? (
                                <p>{signUpError}</p>
                            ) : (null)
                        }
                        <p>Sign Up</p>
                        <input type="email" placeholder="Email" value={signUpEmail} onChange={this.onChangeSignUpEmail} />
                        <br />
                        <input type="password" placeholder="Password" value={signUpPassword} onChange={this.onChangeSignUpPassword} />
                        <br />
                        <button onClick={this.onSignUp}>Sign Up</button>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <p>Account</p>
                <button onClick={this.logout}>Logout</button>
            </div>
        );
    }
}

export default Home;
