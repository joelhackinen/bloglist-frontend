import { useState, useEffect, useRef } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import Message from './components/Message'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogService'
import loginService from './services/loginService'
import jwt_decode from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [messageError, setMessageError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      user.id = jwt_decode(user.token).id
      setUser(user)
      console.log(user)
    }
  }, [])

  const createFormRef = useRef()

  const showMessage = (text, err) => {
    setMessageText(text)
    setMessageError(err)
    setTimeout(() => {
      setMessageText('')
    }, 3000)
  }

  const login = async (username, password) => {
    try {
      const loggedUser = await loginService.login({
        username, password,
      })
      blogService.setToken(loggedUser.token)
      loggedUser.id = jwt_decode(loggedUser.token).id
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(loggedUser)
      )
      showMessage(`welcome, ${username}!`, false)
      setUser(loggedUser)
    }
    catch (e) {
      showMessage('wrong username or password', true)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBloglistUser')
      showMessage('logged out', false)
    }
    catch (e) {
      showMessage('loggin out failed', true)
    }
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      createFormRef.current.toggleVisibility()
      const { token, ...u } = user
      const created = await blogService.create(
        { user: u, ...blogObject }
      )
      console.log(created)
      showMessage(`a new blog ${created.title} by ${created.author} created`, false)
      setBlogs(blogs.concat({ ...created, user: user }))
    }
    catch (e) {
      showMessage(`adding failed: ${e}`, true)
    }
  }

  const editBlog = async (blogObject) => {
    const { id, ...newBlog } = blogObject
    try {
      const created = await blogService.update(
        id,
        newBlog
      )
      setBlogs(blogs.map(b => b.id === id ? b = { ...b, likes: created.likes } : b))
    } catch (e) {
      showMessage('editing failed', true)
    }
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove ${blogObject.title} by ${blogObject.author}?`)) {
      try {
        await blogService.remove(
          blogObject.id
        )
        setBlogs(blogs.filter(b => b.id !== blogObject.id))
        showMessage('blog removed', false)
      }
      catch (e) {
        showMessage(`error in removing: ${e}`, true)
      }
    }
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <div>
        <Message msg={messageText} err={messageError}/>
        <LoginForm
          login={login}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogapp</h2>
      <Message msg={messageText} err={messageError}/>
      {user.name} logged in
      <button id="logout-button" onClick={handleLogout}>Logout</button>
      <Togglable showText='create' hideText='cancel'  ref={createFormRef}>
        <BlogForm createBlog={addBlog} user={user} />
      </Togglable>
      <h3>blogs</h3>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={editBlog} deleteBlog={removeBlog} userId={user.id}/>
      )}
    </div>
  )
}

export default App