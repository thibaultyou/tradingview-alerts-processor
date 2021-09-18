describe('FTX exchange service', () => {
    describe('constructor', () => {
        it.todo('should set exchange id')
    })
    
    describe('fetchPositions', () => {
        it.todo('should fetch positions')

        it.todo('should throw on error')
    })

    describe('getCloseOrderOptions', () => {
        it.todo('should fetch ticker balance if spot')

        it.todo('should handle relative order size if spot')

        it.todo('should handle absolute order size if spot')

        it.todo('should handle maximum order size if spot')

        it.todo('should return spot order options')

        it.todo('should fetch ticker position if futures')

        it.todo('should handle relative order size if futures')

        it.todo('should handle absolute order size if futures')

        it.todo('should handle maximum order size if futures')

        it.todo('should return futures order options')
    })

    describe('handleMaxBudget', () => {
        it.todo('should fetch ticker balance if spot')

        it.todo('should calculate order cost if spot')

        it.todo('should fetch ticker position if futures')

        it.todo('should check absolute order cost against max budget')

        it.todo('should check relative order cost against max budget')

        it.todo('should throw on error')
    })
})