import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('title here')
  const author = screen.getByPlaceholderText('author here')
  const url = screen.getByPlaceholderText('url here')
  const sendButton = screen.getByText('create')

  await user.type(title, 'testing a form...')
  await user.type(author, 'tester')
  await user.type(url, 'test.com :D')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'testing a form...',
    author: 'tester',
    url: 'test.com :D'
  })
})