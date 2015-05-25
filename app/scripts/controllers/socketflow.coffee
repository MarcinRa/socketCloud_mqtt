'use strict'

angular.module('socAngApp')
  .controller 'SocketflowCtrl', ($scope,Scloud) ->
    
    $scope.socketLog = ''
    credentials = undefined
    myEl = angular.element document.querySelector '#log_list'
    
    
    Scloud.on 'error', (err)->
        console.log 'open ligin screen '+err
        goToLoginScreen $scope
        return
    
    Scloud.on 'update_username', (data,resp) ->
        console.log 'update_username -> ' + data.username
        credentials = {username:data.username}
        $scope.user = data.username
        Scloud.onChannel data.username, $scope.showDataInChatBox
        $scope.$apply()
        resp()
        return
    
    Scloud.on 'status', (status) ->
        console.log "status!!"
        console.log status
        
        if status.isAuthenticated 
            Scloud.emit 'am_I_registered', undefined, (err) ->
                if err
                    alert err
                return
            goToMainScreen $scope
        else
            if credentials == undefined
                Scloud.emit 'login', credentials, (err) ->
                  if err
                    alert err
                  else
                    goToMainScreen $scope
                  return
            else
                goToLoginScreen $scope
        return
    
    $scope.logout = ->
        Scloud.emit 'logout', {}, (err) ->
          if err
            alert err
          else
            console.log('you are log out');
            goToLoginScreen $scope
          return  
        return
    
    $scope.register = (user,password) ->
        credentials = {'username':user,'password':password}
        Scloud.emit 'register', credentials, (err) ->
          if err
            alert err
          else
            $scope.login(user,password);
          return
        return
        
    $scope.login = (user,password) ->
        credentials = {'username':user,'password':password}
        
        Scloud.emit 'login', credentials, (err) ->
          if err
            alert err
          else
            Scloud.onChannel user, $scope.showDataInChatBox
            goToMainScreen $scope
          return
        return
    
    Scloud.getIdCb (id)->
        $scope.socket_nr = id
        
    
    Scloud.onChannel 'log_list', (data)->
        console.log "---------callback--------"
        $scope.socketLog += ""+data.username+" : "+data.message+"\n" 
        refreshScroll(myEl)
        $scope.$apply()
        return 
    
    
    $scope.sendToAll = (msg) ->
        console.log 'sendToAll click'
        Scloud.publish 'log_list', {
            id: Scloud.getId()
            message: msg
            },
            (err)->
                if err 
                    console.log 'Error '
                    console.log err
                else
                    console.log 'published successfuly'
                return
        return
    
    $scope.showDataInChatBox = (data) ->
        $scope.socketLog += ""+data.username+" : "+data.message+"\n" 
        refreshScroll(myEl)
        $scope.$apply()
        return
    
    $scope.sendToSocket = (channel,msg) ->
        Scloud.publish channel, { 
            'username': credentials.username
            'id': Scloud.getId()
            'message': msg
            }, (err)->
                if err
                    console.log 'publish to '+channel+' channel error'+err
                return
        
        console.log 'sendToSocket click: '+channel 
        return
        
    return

refreshScroll= (element)->
    element.context.scrollTop = element.context.scrollHeight;
    return

goToMainScreen = (scope)->
    console.log 'goToMainScreen'
    scope.login_board = false
    scope.$apply()
    return
    
goToLoginScreen = (scope)->
    console.log 'goToLoginScreen'
    scope.login_board = true
    scope.$apply()
    return
    