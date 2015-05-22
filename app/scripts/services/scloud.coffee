'use strict'

angular.module('socAngApp')
  .service 'Scloud', ($q) ->
      
      self = this
      self.socket = socketCluster.connect 
              hostname: 'localhost'
              secure: false
              port: 8000
            
#      self.socket.on 'error', (err)-> 
#        throw 'Socket error - ' + err
#        return

      self.deferred = $q.defer()
      self.socket.on 'connect', ->
        console.log 'CONNECTED'
        self.deferred.resolve()
        return
      
      {
        on: (event,cb)->
            self.socket.on event, (data, res) ->
                cb data,res
                return
            return
#       cb - calback(error)
        emit: (event,message,cb) ->
            self.socket.emit event, message, cb
            return
        
        publish: (event,message,cb) ->
            self.socket.publish event, message, cb
            return
        getId: ->
            self.socket.id
        getIdCb: (cb) ->
            self.deferred.promise.then ->
                cb self.socket.id
                return
            return    
        onChannel: (event, cb) ->
            console.log event + " on channel added"
            channel = self.socket.subscribe event
            channel.watch cb
            return
        
        }