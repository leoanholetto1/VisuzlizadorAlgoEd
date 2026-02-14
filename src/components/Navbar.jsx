import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function CustomNavbar() {
    return (
        <Navbar className="custom-navbar" expand="lg">
            <Container>
                <Navbar.Brand href="#">
                    ⚡ Visualizador de Algoritmos
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
