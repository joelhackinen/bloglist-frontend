import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { getByText, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  id: 6,
  likes: 4,
  author: 'Kissa',
  title: 'Kissablogi',
  url: 'kissa.com',
  user: {
    id: 123234345,
    username: 'Kisumisu'
  }
}

describe('<Blog />', () => {
  test('renders content', () => {
    const { container } = render(<Blog blog={blog} />)
    expect(container).toHaveTextContent('Kissablogi by Kissa')
  })

  test('clicking like button adds a like', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} addLike={mockHandler}/>)
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].likes).toBe(5)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('title and author rendered by default, url and likes are not ', () => {
    const { container } = render(<Blog blog={blog} />)
    expect(container).toHaveTextContent('Kissablogi by Kissa')
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })
})