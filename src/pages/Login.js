import "../assets/login.css";
import {Card, StyledBody, StyledAction} from 'baseui/card';
import { useStyletron } from "baseui";
import * as React from "react";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { useNavigate } from "react-router-dom";

function validate(username, password) {
    if (username === "admin" && password === "123456")
        return true;
    return false;
}

export default function Login() {
    const [css] = useStyletron();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();
    const loginContainerCSS = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "black"
    };

    function handleLogin(event) {
        if (validate(username, password)) {
            alert("login success");
            navigate("/");
        }
        else {
            alert("wrong password");
            console.log('error');
        }
        event.preventDefault();
    }
    
    return (
        <div className={css(loginContainerCSS)}>
            <Card overrides={{Root: {style: {width: '420px'}}}}>
                <StyledBody className={css({display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", textAlign: "center"})}>
                    <h1 style={{fontSize: "2rem"}}><span style={{color: "#FFD643"}}>De</span>ISEP <br/> Management System</h1>
                    <div style={{fontSize: "1.5rem", color: "gray", fontWeight: "100"}}>- Sign In -</div>                        
                </StyledBody>
                <StyledAction>
                    <form onSubmit={handleLogin}>
                        <Input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="username"
                            type="text"
                            overrides={{Root: {style: {marginTop: "2rem", marginBottom: '1rem'}}}}
                            clearOnEscape
                        />
                        <Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="password"
                            type="password"
                            overrides={{Root: {style: {marginBottom: '1rem'}}}}
                            clearOnEscape
                        />
                        <Button 
                            overrides={{Root: {style: {width: "100%"}}}}
                            type="submit"
                        >
                            Sign In
                        </Button>
                    </form>
                    </StyledAction>
            </Card>
        </div>
    )
}