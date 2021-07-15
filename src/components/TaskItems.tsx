import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api'

import '../styles/taskitem.scss'

type TaskItemsProps = {
  id: string
  name: string
  email: string
  completed: string
  completedUntil: string
  createdAt: string
  title: string
  token: string
  group: string
}

export default function TaskItems({ id, name, email, completed, completedUntil, createdAt, title, token, group }: TaskItemsProps ) {
  const [newTask, setNewTask] = useState('')

  async function handleCloseTask(taskId: string) {
    const task = {
      completed: new Date()
    }

    await api
      .put(`/tasks/close/${taskId}`, task, { headers: { Authorization: token } })
      .then((response) => {
        if (response.data.task) {
          toast.success('Tarefa concluída com sucesso')
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
      deletedAt: new Date()
    }

    await api
      .put(`/tasks/softdelete/${taskId}`, task, { headers: { Authorization: token } })
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

  function definePeriod(dateTime: string) {
    const hour = new Date(dateTime).getHours()

    if (hour >= 6 && hour < 12) {
      return 'Manhã'
    } else if (hour >= 12 && hour < 18) {
      return 'Tarde'
    } else {
      return 'Noite'
    }
  }

  function elapsedTime(dateTime: string) {
    const now = new Date().getTime()
    const createdAt = new Date(dateTime).getTime()
    const milliElapsed = now - createdAt
    const elapsed = Math.floor(milliElapsed / (1000 * 60 * 60 * 24))

    if (elapsed <= 0) {
      return '0 dias'
    } else if (elapsed === 1) {
      return '1 dia'
    } else {
      return elapsed + ' dias'
    }
  }

  function checkZero(data:number) {
    if (data < 10) {
      return '0' + data.toString()
    }
    return data.toString()
  }

  function formatDate(date: string) {
    if (typeof date !== 'string') {
      return 'não definido'
    }

    const dateObject = new Date(date)
    const year = dateObject.getFullYear().toString()
    const month = checkZero(dateObject.getMonth() + 1)
    const day = checkZero(dateObject.getDate())

    const hour = checkZero(dateObject.getHours())
    const minute = checkZero(dateObject.getMinutes())

    return `${day}/${month}/${year} - ${hour}:${minute}`
  }

  return (
    <>
      <div className="task-item">
        <p className="title">{title}</p>
        <div className="separator">Dados sobre a tarefa</div>

        <footer>
          <div className="detail">
            <span>
              Criada por...........:
              <span className="data">{name}</span>
            </span>
          </div>

          <div className="detail">
            <span>
              Criada em..................:
              <span className="data">
                {formatDate(createdAt)} - ({definePeriod(createdAt)})
              </span>
            </span>
          </div>

          <div className="detail">
            <span>
              Tempo Decorrido:
              <span className="data">{elapsedTime(createdAt)}</span>
            </span>
          </div>

          <div className="detail">
            <span>
              Prazo para conclusão:
              <span className="data">{formatDate(completedUntil)}</span>
            </span>
          </div>

          <div className="detail">
            <span>
              Grupo...................:
              <span className="data">{group ? group : 'não definido'}</span>
            </span>
          </div>

          <div className="detail">
            <span>
              Status da Tarefa.........:
              <span className={completed ? 'task-closed' : 'task-opened'}>
                {completed ? 'Concluída em ' + formatDate(completed) : 'Aberta'}
              </span>
            </span>
          </div>

        </footer>

        <div className="buttons">
          {!completed && (
            <button
              type="button"
              aria-label="Encerrar Tarefa"
              title="Encerrar Tarefa"
              onClick={() => handleCloseTask(id)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="12.0003"
                  cy="11.9998"
                  r="9.00375"
                  stroke="#0cb40c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                  stroke="#0cb40c"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <button type="button" aria-label="Excluir Tarefa" title="Excluit Tarefa" onClick={() => handleDeleteTask(id)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 5.99988H5H21"
                stroke="#dd2818"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
                stroke="#dd2818"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
