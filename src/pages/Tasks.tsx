import { FormEvent, useState } from 'react'
import { ReactNode } from 'react'
import { Link, useHistory } from 'react-router-dom'

import api from '../api'

import '../styles/tasks.scss'
import '../styles/taskitem.scss'

import logoImg from '../assets/img/fig01.png'
import userImg from '../assets/img/user.png'

import { Button } from '../components/Button'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState<String | null>('')
  const [userName, setUserName] = useState<String | null>('')
  const [userEmail, setUserEmail] = useState<String | null>('')
  const [newTask, setNewTask] = useState('');

  const user_id = localStorage.getItem('user_id')
  const user_name = localStorage.getItem('user_name')
  const user_email = localStorage.getItem('user_email')
  const token = localStorage.getItem('token')
  const authStr = 'Bearer ' + token

  const history = useHistory()

  async function getAllTasks() {
    await api
      .get('/tasks', { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.tasks) {
          const tasks = response.data.tasks;
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

  async function handleSendTask(event: FormEvent) {
    event.preventDefault()

    if (newTask.trim() === '') {
      alert('Você não digitou uma nova tarefa.')
      return
    }

    const task = {
      title: newTask,
      completedAt: false,
      completedUntil: null,
      assignedTo: userId
    }

    await api
      .post('/tasks', task, { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.task) {
          alert('Tarefa cadastrada com sucesso!!')
          setNewTask('')
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }


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

        <form onSubmit={handleSendTask}>
          <textarea
            placeholder="Descreva os detalhes da tarefa..."
            onChange={(event) => setNewTask(event.target.value)}
            value={newTask}
          />
          <div className="form-footer">
            <div className="user-info">
              <img src={userImg} />
              <span>Olá, {userName}</span>
            </div>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>

        <div className="task-list">
          {tasks.map(function (value: any, index: number) {
            return (
              <>
                <div className="task-item">
                  <p>{value.title}</p>
                  <footer>
                    <div className="user-info">
                      <span>Criada em: {new Date(value.createdAt).toLocaleString('pt-BR')}</span>
                      <span>
                        Status:
                        <span className={value.completed ? 'task-closed' : 'task-opened'}>
                          {value.completed ? 'Concluída' : 'Aberta'}
                        </span>
                      </span>
                    </div>
                    <div>
                      <button type="button"     aria-label="Encerrar Tarefa"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                            stroke="#737380"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </footer>
                </div>
              </>
            )
          })}

        </div>
      </main>
    </div>
  )
}
