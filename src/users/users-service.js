const xss = require('xss')
const knex = require('knex')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/

const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('game_users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('game_users')
      .returning('*')
      .then(([user]) => user)
  },

  validatePassword(password) {
    if (password.length < 8) {
      return 'Password be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character'
    }
    return null
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    }
  },

  addGame(db, game, id) {
    // const something here to figure out if wins is true or false

    // let win = () => { game ? 'number_wins + 1' : 'number_wins' }
    return db('game_users').update({
      number_games: knex.raw('number_games + 1'),
      number_wins: knex.raw(game ? 'number_wins + 1' : 'number_wins')
    })
      .where({
        id
      })
  },

  // test
  // addWin(db, game, id) {
  //   return db('game_users').update({
  //     number_wins: knex.raw(game ? 'number_wins + 1' : 'number_wins')
  //   })
  //     .where({
  //       id
  //     })
  // },

  getLeaderboard(db) {
    return db.from('game_users').orderBy(
      'number_wins', 'desc'
    )
  }
}

module.exports = UsersService