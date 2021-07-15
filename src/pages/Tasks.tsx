import React, { FormEvent, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { TextField, TextareaAutosize, NativeSelect, Radio } from '@material-ui/core'
import Gravatar from 'react-gravatar'

import api from '../api'

import { Button } from '../components/Button'
import TaskItems from '../components/TaskItems'

import logoImg from '../assets/img/fig01.png'

import '../styles/tasks.scss'

export default function Tasks() {
  const [untilDate, setUntilDate] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [group, setGroup] = useState('')
  const [userId, setUserId] = useState<String | null>('')
  const [userName, setUserName] = useState<String | null>('')
  const [userEmail, setUserEmail] = useState<String | null>('')
  const [filter, setFilter] = useState('all')

  const user_id = localStorage.getItem('user_id')
  const user_name = localStorage.getItem('user_name')
  const user_email = localStorage.getItem('user_email')
  const token = localStorage.getItem('token')
  const authStr = 'Bearer ' + token

  const handleChangeGroup = (event: ChangeEvent<{ value: unknown }>) => {
    const group = event.target.value as string

    setGroup(group)
  }

  const handleUntilDate = (event: ChangeEvent<{ value: unknown }>) => {
    const untilDate = event.target.value as string

    setUntilDate(new Date(untilDate).toString())
  }

  const handleFilter = (event: ChangeEvent<{ value: unknown }>) => {
    const filtro = event.target.value as string

    if (filtro === 'all') {
      getAllTasks()
    } else {
      getLast10Tasks()
    }
    setFilter(filtro)
  }

  async function getLast10Tasks() {
    await api
      .get('/tasks?count=10', { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.tasks) {
          const tasks = response.data.tasks
          setTasks(tasks)
          setUserId(user_id)
          setUserName(user_name)
          setUserEmail(user_email)
          setUntilDate(untilDate)
          setGroup(group)
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }

  async function getAllTasks() {
    await api
      .get('/tasks', { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.tasks) {
          const tasks = response.data.tasks
          setTasks(tasks)
          setUserId(user_id)
          setUserName(user_name)
          setUserEmail(user_email)
          setUntilDate(untilDate)
          setGroup(group)
          setFilter('all')
        }
      })
      .catch((error) => {
        console.log({ error: error.message })
      })
  }

  async function handleSaveTask(event: FormEvent) {
    event.preventDefault()

    if (newTask.trim() === '') {
      toast.error('Você não digitou a descrição da tarefa')
      return
    }

    if (untilDate.trim() === '') {
      toast.error('Você não selecionou uma data de encerramento para a tarefa')
      return
    }

    if (group.trim() === '') {
      toast.error('Você não selecionou um grupo da tarefa')
      return
    }

    const completedDate = new Date(untilDate)

    const task = {
      title: newTask,
      completedUntil: completedDate,
      assignedTo: userId,
      group: group,
      deletedAt: null
    }

    await api
      .post('/tasks', task, { headers: { Authorization: authStr } })
      .then((response) => {
        if (response.data.task) {
          setNewTask('')
          toast.success(`Tarefa cadastrada com sucesso`)
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
          <div>
            <Link className="link" to="/metrics">
              Métricas
            </Link>
            <Link className="link" to="/">
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <div className="user">
            <Gravatar email={userEmail?.toString()} size={45} rating="pg" default="mp" className="gravatar" />
            <span>
              Olá,{' '}
              <span>
                {userName}
              </span>
            </span>
          </div>

          <div className="tasks">
            <div>{tasks.length}</div>
            <h1>Nº de Tarefas:</h1>
          </div>
        </div>

        <form onSubmit={handleSaveTask}>
          <TextareaAutosize
            placeholder="Descreva os detalhes da tarefa..."
            onChange={(event) => setNewTask(event.target.value)}
            value={newTask}
          />

          <TextField
            type="datetime-local"
            id="untilDate"
            label="Concluir esta tarefa até:"
            className="input-date"
            InputLabelProps={{
              shrink: true
            }}
            onChange={handleUntilDate}
          />

          <NativeSelect
            onChange={handleChangeGroup}
            inputProps={{
              name: 'group',
              id: 'group',
              'aria-label': 'Selecione um grupo'
            }}
          >
            <option value="" aria-label="None">
              Selecione um grupo...
            </option>
            <option value="Grupo 1">Grupo 1</option>
            <option value="Grupo 2">Grupo 2</option>
            <option value="Grupo 3">Grupo 3</option>
            <option value="Grupo 4">Grupo 4</option>
          </NativeSelect>

          <div className="form-footer">
            <div className="user-info"></div>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>

        <div className="tools">
          <div className="filter">
            Filtro de Tarefas:
            <Radio
              checked={filter === 'all'}
              onChange={handleFilter}
              value="all"
              name="filter"
              color="primary"
              inputProps={{
                'aria-label': 'Todas as tarefas'
              }}
            />{' '}
            Todas
            <Radio
              checked={filter === 'last10'}
              onChange={handleFilter}
              value="last10"
              name="filter"
              color="secondary"
              inputProps={{
                'aria-label': 'Todas as tarefas'
              }}
            />{' '}
            Últimas 10
          </div>
        </div>

        <div className="task-list">
          {tasks.map(function (task: any, index: number) {
            return (
              <TaskItems
                key={index}
                id={task._id}
                name={task.assignedTo.name}
                email={task.assignedTo.email}
                completed={task.completed}
                completedUntil={task.completedUntil}
                createdAt={task.createdAt}
                title={task.title}
                token={authStr}
                group={task.group}
              />
            )
          })}
        </div>
      </main>
      <Toaster />
    </div>
  )
}
