# dom-events

Binds Dom Events to actions on Highcharts elements.

### Usage

Add event handler as any other event handler in Highcharts:
```javascript
events: {
    contextmenu: function(e) {
        ...
    }
}
```

### Supported events per element

Events       | Plot Area | Series | Point
------------ | --------- | ------ | -----
dblclick     | -         | -      | - 
mousedown    | -         | -      | - 
mouseup  	 | -         | -      | - 
mousemove 	 | -         | -      | - 
mouseout	 | -         | -      | - 
mouseenter 	 | -         | -      | - 
mouseleave	 | -         | -      | - 
wheel		 | +         | -      | - 
contextmenu	 | +         | +      | + 
