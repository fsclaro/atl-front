import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
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
      toast.error('Você não digitou a descrição da tarefa');
      return
    }

    const task = {
      title: newTask,
      completedAt: false,
      completedUntil: null,
      assignedTo: userId,
      deletedAt: null,
    }

    await api
      .post('/tasks', task, { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.task) {
          setNewTask('')
          toast.success(`Tarefa cadastrada com sucesso`)
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }

  async function handleCloseTask(taskId: string) {
    const task = {
      completed: true,
      completedAt: new Date(),
    }

    await api
      .put(`/tasks/close/${taskId}`, task, { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.task) {
          toast.success('Tarefa concluída com sucesso');
          setNewTask('')
          window.location.reload()
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }


  async function handleDeleteTask(taskId: string) {
    const task = {
      deletedAt: new Date(),
    }

    await api
      .put(`/tasks/softdelete/${taskId}`, task, { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.task) {
          toast.success('Tarefa excluída com sucesso!!')
          setNewTask('')
          window.location.reload()
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
                      <span>
                        Criada por:
                        <span className="user-name">{value.assignedTo.name}</span> em
                        <span className="created-at">{new Date(value.createdAt).toLocaleString('pt-BR')}</span>
                      </span>
                      <span>
                        Status:
                        <span className={value.completed ? 'task-closed' : 'task-opened'}>
                          {value.completed ? 'Concluída' : 'Aberta'}
                        </span>
                      </span>
                    </div>
                    <div>
                      {!value.completed && (
                        <button
                          type="button"
                          aria-label="Encerrar Tarefa"
                          title="Encerrar Tarefa"
                          onClick={() => handleCloseTask(value._id)}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12.0003"
                              cy="11.9998"
                              r="9.00375"
                              stroke="#737380"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                              stroke="#737380"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="Excluir Tarefa"
                        title="Excluit Tarefa"
                        onClick={() => handleDeleteTask(value._id)}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3 5.99988H5H21"
                            stroke="#737380"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                            stroke="#737380"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
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
      <Toaster />
    </div>
  )
}
