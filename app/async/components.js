/**
 * Created by peter on 2/8/17.
 */
export default {
    // import('../components/login')
    login: (cb) => require.ensure([],() => cb(require('../components/login')),'login'),
    calendar: (cb) => require.ensure([],() => cb(require('../components/calendar/calendar_component')),'calendar'),
    user_settings: (cb) => require.ensure([],() => cb(require('../components/user_settings')),'user_settings')
}