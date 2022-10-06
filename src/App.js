import { useState, useEffect } from 'react'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import Message from './components/Message'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import blogService from './services/blogService'
import loginService from './services/loginService'
import jwt_decode from 'jwt-decode'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const showMessage = (text, err) => {
    setMessageText(text)
    setMessageError(err)
    setTimeout(() => {
      setMessageText('')
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const u = await loginService.login({
        username, password,
      })
      showMessage(`welcome, ${username}!`, false)
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(u)
      )

      blogService.setToken(u.token)
      setUser(u)
      setUsername('')
      setPassword('')
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
    catch {
      showMessage('loggin out failed', true)
    }
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const created = await blogService.create(
        blogObject
      )
      showMessage(`a new blog ${created.title} by ${created.author} created`, false)
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    }
    catch (e) {
      showMessage(`adding failed: ${e}`, true)
    }
  }

  const editBlog = async (blogObject) => {
    const {id, ...newBlog} = blogObject
    try {
      const created = await blogService.update(
        id,
        newBlog
      )
      setBlogs(blogs.map(b => b.id === id ? b = {...b, likes: created.likes} : b))
    } catch {
      showMessage('editing failed', true)
    }
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove ${blogObject.title} by ${blogObject.author}?`)) {
      try {
        await blogService.remove(
          blogObject.id
        )
        const newBlogs = await blogService.getAll()
        setBlogs(newBlogs)
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
        <LoginForm 
          handleLogin={handleLogin}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }
  
  return (
    <div>
      <h2>blogapp</h2>
      <Message msg={messageText} err={messageError}/>
      {user.name} logged in
      <button onClick={handleLogout}>Logout</button>
      <Togglable showText='create' hideText='cancel'>
        <CreateForm createBlog={addBlog}/>
      </Togglable>
      <h3>blogs</h3>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} addLike={editBlog} deleteBlog={removeBlog} userId={user.id}/>
      )}
    </div>
  )
}

export default App