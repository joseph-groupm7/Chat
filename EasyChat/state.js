module.exports = function(){
    return {
        idle_users : [],
        ongoing_chats : [],
        active_admins : [],
        lighten : function(){
            var idle_users = [];
            var active_admins = [];
            var ongoing_chats = [];

            this.idle_users.map(function(client){
                idle_users.push(client.lighten());
            });

            this.active_admins.map(function(client){
                active_admins.push(client.lighten());
            });

            this.ongoing_chats.map(function(chat){
                ongoing_chats.push(chat.lighten());
            });

            return {idle_users:idle_users, active_admins:active_admins, ongoing_chats:ongoing_chats};
        }
    };
};