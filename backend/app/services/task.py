from sqlmodel import Session, select
from ..models.task import Task, TaskCreate, TaskUpdate
from ..models.user import User
from typing import List, Optional
from datetime import datetime


def create_task(*, session: Session, task_create: TaskCreate, owner_id: int) -> Task:
    db_task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed,
        owner_id=owner_id
    )
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


def get_tasks_by_owner(*, session: Session, owner_id: int, skip: int = 0, limit: int = 100) -> List[Task]:
    statement = select(Task).where(Task.owner_id == owner_id).offset(skip).limit(limit)
    tasks = session.exec(statement).all()
    return tasks


def get_task_by_id(*, session: Session, task_id: int, owner_id: int) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    task = session.exec(statement).first()
    return task


def update_task(*, session: Session, db_task: Task, task_update: TaskUpdate) -> Task:
    task_data = task_update.dict(exclude_unset=True)
    for field, value in task_data.items():
        setattr(db_task, field, value)

    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


def delete_task(*, session: Session, db_task: Task) -> Task:
    session.delete(db_task)
    session.commit()
    return db_task


def toggle_task_completion(*, session: Session, db_task: Task) -> Task:
    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow()
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


def get_tasks_by_status(*, session: Session, owner_id: int, completed: Optional[bool] = None, skip: int = 0, limit: int = 100) -> List[Task]:
    statement = select(Task).where(Task.owner_id == owner_id)
    if completed is not None:
        statement = statement.where(Task.completed == completed)
    statement = statement.offset(skip).limit(limit)
    tasks = session.exec(statement).all()
    return tasks