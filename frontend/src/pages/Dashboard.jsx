import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadUser } from '../store/user'
import GoogleAuthButton from '../components/GoogleAuthButton'
import { useNavigate } from 'react-router-dom'
import Contacts from './Contacts'

export default function Dashboard() {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.user.userId)
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) {
      navigate('/login')
      return
    }
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          const data = await response.json()
          dispatch(loadUser(data))
        } else {
          dispatch(loadUser(null))
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        dispatch(loadUser(null))
      }
    }
    fetchUser()
  }, [userId, dispatch, navigate])

  // CSS IMPROVEMENTS
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(105deg, #F5F9FF 60%, #ecfaf6 100%)',
      padding: '22px 0 24px',
    },
    dashboardHeader: {
      fontSize: '2.2rem',
      fontWeight: 800,
      letterSpacing: '0.01em',
      color: '#1557b7',
      marginBottom: '18px',
      textShadow: '0 2px 9px #e7eefd, 0 1px 2px #b4dbfe42',
      textAlign: 'center'
    },
    profileCard: {
      maxWidth: '420px',
      margin: '22px auto 38px',
      borderRadius: '21px',
      boxShadow: '0 9px 28px rgba(0,105,160,0.12), 0 2px 11px rgba(80,140,255,0.10)',
      background: 'linear-gradient(120deg, #fff 75%, #e4f0ff 100%)',
      padding: '2.4rem 1.8rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      border: '1.5px solid #e7ebf1'
    },
    avatarWrapper: {
      width: '94px',
      height: '94px',
      borderRadius: '50%',
      background: 'linear-gradient(190deg, #2979ff 54%, #51e9d2 120%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '3.4rem',
      color: 'white',
      marginBottom: '18px',
      boxShadow: '0 2.5px 15px rgba(33,146,255,0.19)'
    },
    name: {
      margin: '0 0 9px',
      fontWeight: 700,
      fontSize: '1.49rem',
      color: '#244164',
      letterSpacing: '0.01em',
      textAlign: 'center',
      wordBreak: 'break-word'
    },
    email: {
      fontSize: '1.08rem',
      color: '#385688',
      margin: 0,
      marginBottom: '14px',
      wordBreak: 'break-all',
      fontWeight: 400,
      letterSpacing: '0.015em',
      padding: '3px 11px',
      background: 'rgba(65,130,245,0.07)',
      borderRadius: '5px'
    },
    googleBtnSection: {
      margin: '19px 0 4px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    contactsOuterWrap: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '12px',
      width: '100%',
    },
    contactsBoxWrap: {
      width: '100%',
      maxWidth: '1080px',
      background: 'white',
      borderRadius: '17px',
      boxShadow: '0 4px 22px rgba(120,180,210,0.13), 0 1.5px 5px rgba(130,160,180,0.11)',
      padding: '0 5px 12px',
      minHeight: '50px'
    },
    loadingText: {
      margin: '40px auto',
      textAlign: 'center',
      fontSize: '1.13rem',
      color: '#888',
      fontWeight: 500,
      letterSpacing: '0.01em'
    }
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.dashboardHeader}>Dashboard</div>
      {user ? (
        <div>
          <div style={styles.profileCard}>
            <div style={styles.avatarWrapper}>
              <span>
                {(user.user_name || user.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 style={styles.name}>
              {user.user_name || user.name}
            </h3>
            <div style={styles.email}>{user.email}</div>
            <div style={styles.googleBtnSection}>
              <GoogleAuthButton />
            </div>
          </div>
          <div style={styles.contactsOuterWrap}>
            <div style={styles.contactsBoxWrap}>
              <Contacts />
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.loadingText}>Loading user data...</div>
      )}
    </div>
  )
}
