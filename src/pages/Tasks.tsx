import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

import '../styles/tasks.scss'
import logoImg from '../assets/img/fig01.png'
import userImg from '../assets/img/user.png'

import { Button } from '../components/Button'
//import { TasksItems } from '../components/TasksItems'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState<String | null>('')
  const [userName, setUserName] = useState<String | null>('')
  const [userEmail, setUserEmail] = useState<String | null>('')

  async function getAllTasks() {
    const user_id = localStorage.getItem('user_id')
    const user_name = localStorage.getItem('user_name')
    const user_email = localStorage.getItem('user_email')
    const token = localStorage.getItem('token')

    const authStr = 'Bearer ' + token

    await api
      .get('/tasks', {
        headers: {
          Authorization: authStr,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((response) => {
        if (response.data.tasks) {
          const tasks = response.data.tasks

          setTasks(tasks)
          setUserId(user_id)
          setUserName(user_name)
          setUserEmail(user_email)
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }

  console.log(tasks);

  return (
    <div id="page-room" onLoad={getAllTasks}>
      <header>
        <div className="content">
          <img src={logoImg} alt="Advanced TODO List" />
          <Link to="/">Logout</Link>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Nº de Tarefas: </h1>
          <span>{tasks.length} tarefas(s)</span>
        </div>

        <form>
          <textarea placeholder="Descreva os detalhes da tarefa..." />
          <div className="form-footer">
            <div className="user-info">
              <img src={userImg} />
              <span>Olá, {userName}</span>
            </div>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>

        <div className="task-list">
          {tasks.forEach([task, ] => function () {
          })}
        </div>
      </main>
    </div>
  )
}
