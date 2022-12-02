function modalAway() {

    // Transition
    document.getElementById("introModal").classList.add("modal_upwards")

    // Wait
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    
    // Delete the modal
    delay(2000).then(function(){
        
        document.getElementById("introModal").remove()
    });

}
