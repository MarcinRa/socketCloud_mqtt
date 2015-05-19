'use strict'

angular.module('socAngApp')
  .service 'Scloud', ($q) ->
      socket = socketCluster.connect()
      self = this
      socket.on 'error', (err)-> 
        throw 'Socket error - ' + err
        return
      self.deferred = $q.defer()
      socket.on 'connect', ->
        console.log 'CONNECTED'
        self.deferred.resolve()
        return
      
      {
        on: (event,cb)->
            socket.on event, (data, res) ->
                cb data,res
                return
            return
        
        emit: (event,message,cb) ->
            socket.emit event, message, cb
            return
        
        publish: (event,message,cb) ->
            socket.publish event, message, cb
            return
        getId: ->
            socket.id
        getIdCb: (cb) ->
            self.deferred.promise.then ->
                cb socket.id
                return
            return    
        onChannel: (event, cb) ->
            console.log event + " on channel added"
            channel = socket.subscribe event
            channel.watch cb
            return
        
        }