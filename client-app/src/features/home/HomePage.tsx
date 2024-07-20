import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button, Divider } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";
import { GoogleLogin } from "@react-oauth/google";

export default observer(function HomePage() {
    const { userStore, modalStore } = useStore();
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                    Reactivities
                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Reactivities'></Header>
                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to Activities!
                        </Button>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <div style={{ flexDirection: 'row' }}>
                            <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>
                                Login!
                            </Button>
                            <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>
                                Register
                            </Button>
                        </div>

                        <Divider horizontal inverted>Or</Divider>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                if (credentialResponse.credential)
                                    userStore.googleLogin(credentialResponse.credential);
                            }}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                            shape="pill"
                            type="icon" />
                    </div>
                )}
            </Container>
        </Segment>
    )
})