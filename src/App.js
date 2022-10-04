import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import CreateForm from './components/CreateForm'
import blogService from './services/blogService'
import loginService from './services/loginService'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const u = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(u)
      )
      blogService.setToken(u.token)
      setUser(u)
      setUsername('')
      setPassword('')
    }
    catch (e) {
      window.alert(e)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const created = await blogService.create({
        title, author, url,
      })
      setBlogs(blogs.concat(created))
    }
    catch (e) {
      window.alert(e)
    }
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  
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
      <h2>blogs</h2>
      {user.name} logged in
      <button onClick={handleLogout}>Logout</button>
      <CreateForm 
        handleCreate={handleCreate}
        setTitle={setTitle}
        setAuthor={setAuthor}
        setUrl={setUrl}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App