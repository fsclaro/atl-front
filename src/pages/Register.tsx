import React from 'react'
import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '../components/Button'

import logoImg from '../assets/img/fig01.png'
import api from '../api'

import '../styles/auth.scss'

export default function Register() {
  const [nome, setNewNome] = useState('');
  const [email, setNewEmail] = useState('');
  const [password, setNewPassword] = useState('');

  const history = useHistory();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      name: nome,
      email: email,
      password: password
    };

    try {
      await api.post('/auth/register', data).then((response) => {
        if (response.data.token) {
          alert('Cadastrado com sucesso!');
          history.push('/tasks');
        }
      });
    } catch (err) {
    }
  };

  return (
    <div id="login">
      <aside>
        <img src={logoImg} alt="Logo do projeto" />
        <strong>Advanced TODO List</strong>
        <p>Sistema de controle de tarefas.</p>
      </aside>
      <main>
        <div className="main-content">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Nome"
              onChange={(event) => setNewNome(event.target.value)}
              value={nome}
            />
            <input
              type="text"
              name="email"
              placeholder="E-mail"
              onChange={(event) => setNewEmail(event.target.value)}
              value={email}
              autoComplete="email"
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              onChange={(event) => setNewPassword(event.target.value)}
              value={password}
            />
            <Button type="submit">Registrar-se</Button>
          </form>
          <div className="separator">ou</div>
          <div className="link-register">
            Clique
            <Link to="/">aqui</Link> para retornar.
          </div>
        </div>
      </main>
    </div>
  )
}
