function ArrayHas(array, new_object) {
    array.forEach(element => {
        if (element.toString() == new_object.toString())
            return true
    });
    return false;
}
export { ArrayHas }