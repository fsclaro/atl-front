import { ReactNode } from 'react'
import cx from 'classnames'

import '../styles/tasks.scss'


type TasksProps = {
  id: string,
  title: string,
  assignedTo: string,
  createdAt: string,
  completed: boolean,
  children?: ReactNode,
}

export function TasksItems({ task, children }) {
  return (
    <>
      <div className={cx('task', { completed: completed })}>
        <p>{title}</p>
        <footer>
          <div className="user-info">
            <span>{assignedTo}</span>
          </div>
          {/* <div>{children}</div> */}
        </footer>
      </div>
    </>
  )
}
