import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Button } from '../components/Button'

import api from '../api'
import logoImg from '../assets/img/fig01.png'

import '../styles/auth.scss'

export default function Home() {
  const [email, setNewEmail] = useState('')
  const [password, setNewPassword] = useState('')

  const history = useHistory()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = {
      email: email,
      password: password
    }

    await api
      .post('/auth/login', data)
      .then((response) => {
        if (response.data.token) {
          const user_id = response.data.user._id;
          const user_name = response.data.user.name;
          const user_email = response.data.user.email;
          const token = response.data.token;

          localStorage.setItem('user_id', user_id);
          localStorage.setItem('user_name', user_name);
          localStorage.setItem('user_email', user_email);
          localStorage.setItem('token', token);

          history.push('/tasks')
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }

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
              name="email"
              placeholder="E-mail"
              onChange={(event) => setNewEmail(event.target.value)}
              value={email}
            />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              onChange={(event) => setNewPassword(event.target.value)}
              value={password}
            />
            <Button type="submit">Acessar</Button>
          </form>
          <div className="separator">ou</div>
          <div className="link-register">
            Clique
            <Link to="/register">aqui</Link> para registrar-se.
          </div>
        </div>
      </main>
    </div>
  )
}
