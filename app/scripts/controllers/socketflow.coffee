'use strict'

angular.module('socAngApp')
  .controller 'SocketflowCtrl', ($scope,Scloud) ->
    $scope.awesomeThings = [
      'HTML5 Boilerplate'
      'AngularJS'
      'Karma'
    ]
    $scope.socketLog = ''
    myEl = angular.element document.querySelector '#log_list'
    console.log 'controler online'
    Scloud.getIdCb (id)->
        $scope.socket_nr = id
    Scloud.on 'rand', (data,res)->
        $scope.socketLog += data.toString() + "\n"
        refreshScroll(myEl)
        $scope.$apply()
        return 
    
    Scloud.onChannel 'log_list', (data)->
        console.log "---------callback--------"
        $scope.socketLog += ""+data.id+" : "+data.message+"\n" 
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
        
    $scope.sendToSocket = (socket) ->
        console.log 'sendToSocket click: ' + socket 
        return
        
    return

refreshScroll= (element)->
    element.context.scrollTop = element.context.scrollHeight;
    return