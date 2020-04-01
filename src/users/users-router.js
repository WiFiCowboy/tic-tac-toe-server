const express = require('express')
const path = require('path')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name } = req.body
    for (const field of ['full_name', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    // added const for password 
    const passwordError = UsersService.validatePassword(password)
    if (passwordError)
      return res.status(400).json({ error: passwordError })
    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {

            const newUser = {
              user_name,
              password: hashedPassword,
              full_name,
              date_created: 'now()',
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })


usersRouter
  .post('/game', jsonBodyParser, requireAuth, (req, res, next) => {
    const { game } = req.body
    UsersService.addGame(
      req.app.get('db'),
      game,
      req.user.id
    )
      .then(() => {
        res.status(201).send('game was updated')
      })
  })

// // test route
// usersRouter
//   .post('/game', jsonBodyParser, requireAuth, (req, res, next) => {
//     const { game } = req.body
//     UsersService.addWin(
//       req.app.get('db'),
//       game,
//       req.user.id
//     )
//       .then(() => {
//         res.status(201).send('win was updated')
//       })
//   })

usersRouter
  .get('/leaderboard', (req, res) => {
    UsersService.getLeaderboard(req.app.get('db'))
      .then(data => {
        res.json(data)
      })
  })

module.exports = usersRouter