import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

@Component({
  selector: 'app-alto',
  templateUrl: './alto.component.html',
  styleUrls: ['./alto.component.css']
})
export class AltoComponent implements OnInit {
myForm=this.builder.group({
  fName:['',[Validators.required,Validators.minLength(4)]],
  lName:['',[Validators.required,Validators.minLength(4)]],
  address:this.builder.group({
    city:['',[Validators.required,Validators.minLength(4)]],
    state:['',[Validators.required,Validators.minLength(4)]]
  }),
  //custom validation
  program:['',[Validators.required,this.programValidator(/java/i)]],  // java is the only allowed value
  //conditional validation
  email:[''],
  subscribe:[false],
  //dynamic form controls 
  cars:this.builder.array([
    this.builder.control('')
  ]),
  //Crosss field validation. Here validators are passed on the from group level not form control level as in above cases.
  password:[''],
  confirmPassword:['']

},{validators:this.passwordValidator});//for cross field validation
  constructor(private builder:FormBuilder) { }

  ngOnInit() {
    //The following code is for conditional validation,when subscribe is checked,email is required or else not required
    this.myForm.get('subscribe').valueChanges.subscribe(checkedValue=>{
      const emailControl=this.myForm.get('email');
      if(checkedValue)
      emailControl.setValidators(Validators.required);
      else
      emailControl.clearValidators();

      emailControl.updateValueAndValidity();
    })
  }
  public save(){
    console.warn(this.myForm);
    
  }
  get myGetForm(){
    return this.myForm;
  }
  get firstName(){
    return this.myForm.get('fName');
  }
  get lastName(){
    return this.myForm.get('lName');
    }
  get myCity(){
    return this.myForm.get('address').get('city');
    }
  get myState(){
    return this.myForm.get('address').get('state');
  }
  get myProgram(){
    return this.myForm.get('program');
  }
  get myEmail(){
    return this.myForm.get('email');
  }
  get myCars(){
    return this.myForm.get('cars') as FormArray;
  }
  public addCar(){
    this.myCars.push(this.builder.control(''));
  }
//Custom validator -only java regex word is allowed. 
//A function that receives a control as a parameter and returns an object or none based on validation
  public programValidator(regex:RegExp):ValidatorFn{
    return (control:AbstractControl):{[key:string]:any}|null=>{
      // console.warn(control); if you uncomment this function will be called on every change in program field
      var flag=regex.test(control.value);
      return !flag?{'forbidden':{value:control.value}}:null;
    }
  }
  public passwordValidator(control:AbstractControl):{[key:string]:boolean}|null{
    const passwordControl=control.get('password');
    const confirmPasswordControl=control.get('confirmPassword');
    if(passwordControl.pristine || confirmPasswordControl.pristine){
      return null;
    }
    return passwordControl && confirmPasswordControl && passwordControl.value!=confirmPasswordControl.value?
    {'passwordMismatch':true}:null;
    }
}
