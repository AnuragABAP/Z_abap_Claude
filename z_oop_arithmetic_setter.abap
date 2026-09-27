*&---------------------------------------------------------------------*
*& Report Z_OOP_ARITHMETIC_SETTER
*&---------------------------------------------------------------------*
*& Demonstrates OOP concepts in ABAP without a constructor: the object
*& is created first, then a setter method loads the three variables,
*& and further methods perform the arithmetic operations.
*&---------------------------------------------------------------------*
REPORT z_oop_arithmetic_setter.

* Common numeric type used by both the selection screen and the class,
* so actual and formal parameters are type-compatible
TYPES: ty_num TYPE p LENGTH 16 DECIMALS 2.

*----------------------------------------------------------------------*
* Selection screen: the three input values (no default values)
*----------------------------------------------------------------------*
PARAMETERS: p_num1 TYPE ty_num,
            p_num2 TYPE ty_num,
            p_num3 TYPE ty_num.

*----------------------------------------------------------------------*
* Class definition
*----------------------------------------------------------------------*
CLASS lcl_arithmetic DEFINITION.
  PUBLIC SECTION.
    METHODS:
      set_values
        IMPORTING iv_num1 TYPE ty_num
                  iv_num2 TYPE ty_num
                  iv_num3 TYPE ty_num,
      add         RETURNING VALUE(rv_result) TYPE ty_num,
      subtract    RETURNING VALUE(rv_result) TYPE ty_num,
      multiply    RETURNING VALUE(rv_result) TYPE ty_num,
      divide      RETURNING VALUE(rv_result) TYPE ty_num
                  RAISING   cx_sy_zerodivide,
      display_results.

  PRIVATE SECTION.
    " The three variables (encapsulated as private attributes)
    DATA: mv_num1 TYPE ty_num,
          mv_num2 TYPE ty_num,
          mv_num3 TYPE ty_num.
ENDCLASS.

*----------------------------------------------------------------------*
* Class implementation
*----------------------------------------------------------------------*
CLASS lcl_arithmetic IMPLEMENTATION.

  METHOD set_values.
    mv_num1 = iv_num1.
    mv_num2 = iv_num2.
    mv_num3 = iv_num3.
  ENDMETHOD.

  METHOD add.
    rv_result = mv_num1 + mv_num2 + mv_num3.
  ENDMETHOD.

  METHOD subtract.
    rv_result = mv_num1 - mv_num2 - mv_num3.
  ENDMETHOD.

  METHOD multiply.
    rv_result = mv_num1 * mv_num2 * mv_num3.
  ENDMETHOD.

  METHOD divide.
    " Raises CX_SY_ZERODIVIDE if num2 or num3 is zero
    rv_result = mv_num1 / mv_num2 / mv_num3.
  ENDMETHOD.

  METHOD display_results.
    DATA: lv_sum      TYPE ty_num,
          lv_diff     TYPE ty_num,
          lv_product  TYPE ty_num,
          lv_quotient TYPE ty_num.

    lv_sum     = add( ).
    lv_diff    = subtract( ).
    lv_product = multiply( ).

    WRITE: / 'Arithmetic Operations using ABAP Objects'.
    ULINE.
    WRITE: / 'Number 1       :', mv_num1,
           / 'Number 2       :', mv_num2,
           / 'Number 3       :', mv_num3.
    ULINE.
    WRITE: / 'Addition       :', lv_sum,
           / 'Subtraction    :', lv_diff,
           / 'Multiplication :', lv_product.

    TRY.
        lv_quotient = divide( ).
        WRITE: / 'Division       :', lv_quotient.
      CATCH cx_sy_zerodivide.
        WRITE: / 'Division       : Error - division by zero'.
    ENDTRY.
  ENDMETHOD.

ENDCLASS.

*----------------------------------------------------------------------*
* Main program
*----------------------------------------------------------------------*
DATA lo_calc TYPE REF TO lcl_arithmetic.

START-OF-SELECTION.
  " Create the object (no constructor - attributes start at 0)
  CREATE OBJECT lo_calc.

  " Load the three variables through the setter method
  lo_calc->set_values( iv_num1 = p_num1
                       iv_num2 = p_num2
                       iv_num3 = p_num3 ).

  lo_calc->display_results( ).
