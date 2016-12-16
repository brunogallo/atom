var Sayings;
(function (Sayings) {
    var Greeter = (function () {
        function Greeter(message) {
            this.greeting = message;
        }
        Greeter.prototype.greet = function () {
            return "Hello, " + this.greeting;
        };
        return Greeter;
    })();
    Sayings.Greeter = Greeter;
})(Sayings || (Sayings = {}));
var greeter = new Sayings.Greeter("world");
var button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function () {
    alert(greeter.greet());
};
document.body.appendChild(button);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL3ZpdGFtaW5hZnJvbnQvLmF0b20vcGFja2FnZXMvc2V0aS1zeW50YXgvc2FtcGxlLWZpbGVzL1R5cGVzY3JpcHQudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy92aXRhbWluYWZyb250Ly5hdG9tL3BhY2thZ2VzL3NldGktc3ludGF4L3NhbXBsZS1maWxlcy9UeXBlc2NyaXB0LnRzIl0sIm5hbWVzIjpbIlNheWluZ3MiLCJTYXlpbmdzLkdyZWV0ZXIiLCJTYXlpbmdzLkdyZWV0ZXIuY29uc3RydWN0b3IiLCJTYXlpbmdzLkdyZWV0ZXIuZ3JlZXQiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sT0FBTyxDQVViO0FBVkQsV0FBTyxPQUFPLEVBQUMsQ0FBQztJQUNaQSxJQUFhQSxPQUFPQTtRQUVoQkMsU0FGU0EsT0FBT0EsQ0FFSkEsT0FBZUE7WUFDdkJDLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLE9BQU9BLENBQUNBO1FBQzVCQSxDQUFDQTtRQUNERCx1QkFBS0EsR0FBTEE7WUFDSUUsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDckNBLENBQUNBO1FBQ0xGLGNBQUNBO0lBQURBLENBQUNBLEFBUkRELElBUUNBO0lBUllBLGVBQU9BLEdBQVBBLE9BUVpBLENBQUFBO0FBQ0xBLENBQUNBLEVBVk0sT0FBTyxLQUFQLE9BQU8sUUFVYjtBQUNELElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUUzQyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDO0FBRUYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgU2F5aW5ncyB7XG4gICAgZXhwb3J0IGNsYXNzIEdyZWV0ZXIge1xuICAgICAgICBncmVldGluZzogc3RyaW5nO1xuICAgICAgICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZ3JlZXRpbmcgPSBtZXNzYWdlO1xuICAgICAgICB9XG4gICAgICAgIGdyZWV0KCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiSGVsbG8sIFwiICsgdGhpcy5ncmVldGluZztcbiAgICAgICAgfVxuICAgIH1cbn1cbnZhciBncmVldGVyID0gbmV3IFNheWluZ3MuR3JlZXRlcihcIndvcmxkXCIpO1xuXG52YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5idXR0b24udGV4dENvbnRlbnQgPSBcIlNheSBIZWxsb1wiO1xuYnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICBhbGVydChncmVldGVyLmdyZWV0KCkpO1xufTtcblxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuIl19
//# sourceURL=/Users/vitaminafront/.atom/packages/seti-syntax/sample-files/Typescript.ts