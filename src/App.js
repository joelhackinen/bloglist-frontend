import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
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
  const [messageText, setMessageText] = useState('')
  const [messageError, setMessageError] = useState(false)

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

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const created = await blogService.create({
        title, author, url,
      })
      showMessage(`a new blog ${title} by ${author} created`, false)
      setBlogs(blogs.concat(created))
      setTitle('')
      setAuthor('')
      setUrl('')
    }
    catch (e) {
      showMessage('adding failed', true)
    }
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
      <Message msg={messageText} err={messageError}/>
      {user.name} logged in
      <button onClick={handleLogout}>Logout</button>
      <CreateForm 
        handleCreate={handleCreate}
        title={title}
        author={author}
        url={url}
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